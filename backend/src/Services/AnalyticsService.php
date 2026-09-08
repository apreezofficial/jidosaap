<?php

declare(strict_types=1);

namespace App\Services;

use App\Database\Connection;
use PDO;

final class AnalyticsService
{
    public function getDashboardStats(string $workspaceId, string $period = '7d'): array
    {
        $pdo = Connection::get();
        [$startDate, $prevStart, $prevEnd] = $this->getPeriodDates($period);

        // Messages stats
        $msgStmt = $pdo->prepare("
            SELECT
                COUNT(*) FILTER (WHERE direction = 'inbound')  AS messages_received,
                COUNT(*) FILTER (WHERE direction = 'outbound') AS messages_sent,
                COUNT(*) FILTER (WHERE direction = 'inbound' AND created_at >= ?) AS messages_received_period,
                COUNT(*) FILTER (WHERE direction = 'outbound' AND created_at >= ?) AS messages_sent_period
            FROM messages
            WHERE workspace_id = ? AND created_at >= ?
        ");
        $msgStmt->execute([$startDate, $startDate, $workspaceId, $startDate]);
        $msgStats = $msgStmt->fetch(PDO::FETCH_ASSOC);

        // Conversations
        $convStmt = $pdo->prepare("
            SELECT
                COUNT(*) AS total_conversations,
                COUNT(*) FILTER (WHERE handler_mode = 'ai') AS ai_conversations,
                COUNT(*) FILTER (WHERE handler_mode = 'human') AS human_conversations,
                COUNT(*) FILTER (WHERE status = 'open') AS open_conversations
            FROM conversations
            WHERE workspace_id = ? AND created_at >= ?
        ");
        $convStmt->execute([$workspaceId, $startDate]);
        $convStats = $convStmt->fetch(PDO::FETCH_ASSOC);

        // Leads
        $leadStmt = $pdo->prepare("
            SELECT
                COUNT(*) AS total_leads,
                COUNT(*) FILTER (WHERE stage = 'won') AS won_leads,
                SUM(value) FILTER (WHERE stage = 'won') AS won_value
            FROM leads
            WHERE workspace_id = ? AND created_at >= ?
        ");
        $leadStmt->execute([$workspaceId, $startDate]);
        $leadStats = $leadStmt->fetch(PDO::FETCH_ASSOC);

        // Automation runs
        $autoStmt = $pdo->prepare("
            SELECT
                COUNT(*) AS total_runs,
                COUNT(*) FILTER (WHERE status = 'completed') AS successful_runs,
                COUNT(*) FILTER (WHERE status = 'failed') AS failed_runs
            FROM automation_runs
            WHERE workspace_id = ? AND started_at >= ?
        ");
        $autoStmt->execute([$workspaceId, $startDate]);
        $autoStats = $autoStmt->fetch(PDO::FETCH_ASSOC);
        // AI resolution rate
        $aiTotal = (int) ($convStats['ai_conversations'] ?? 0);
        $totalConv = (int) ($convStats['total_conversations'] ?? 0);
        $aiRate = $totalConv > 0 ? round(($aiTotal / $totalConv) * 100, 1) : 0;

        return [
            'period'               => $period,
            'messages_received'    => (int) ($msgStats['messages_received'] ?? 0),
            'messages_sent'        => (int) ($msgStats['messages_sent'] ?? 0),
            'total_conversations'  => $totalConv,
            'ai_conversations'     => $aiTotal,
            'human_conversations'  => (int) ($convStats['human_conversations'] ?? 0),
            'open_conversations'   => (int) ($convStats['open_conversations'] ?? 0),
            'ai_resolution_rate'   => $aiRate,
            'total_leads'          => (int) ($leadStats['total_leads'] ?? 0),
            'won_leads'            => (int) ($leadStats['won_leads'] ?? 0),
            'won_value'            => (float) ($leadStats['won_value'] ?? 0),
            'automation_runs'      => (int) ($autoStats['total_runs'] ?? 0),
            'successful_runs'      => (int) ($autoStats['successful_runs'] ?? 0),
            'failed_runs'          => (int) ($autoStats['failed_runs'] ?? 0),
        ];
    }

    public function getMessageSeries(string $workspaceId, string $period = '7d'): array
    {
        $pdo = Connection::get();
        [$startDate] = $this->getPeriodDates($period);

        $stmt = $pdo->prepare("
            SELECT
                DATE(created_at) AS date,
                COUNT(*) FILTER (WHERE direction = 'inbound')  AS received,
                COUNT(*) FILTER (WHERE direction = 'outbound') AS sent
            FROM messages
            WHERE workspace_id = ? AND created_at >= ?
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        ");
        $stmt->execute([$workspaceId, $startDate]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getLeadSeries(string $workspaceId, string $period = '30d'): array
    {
        $pdo = Connection::get();
        [$startDate] = $this->getPeriodDates($period);

        $stmt = $pdo->prepare("
            SELECT
                DATE(created_at) AS date,
                COUNT(*) AS total,
                COUNT(*) FILTER (WHERE stage = 'won') AS won
            FROM leads
            WHERE workspace_id = ? AND created_at >= ?
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        ");
        $stmt->execute([$workspaceId, $startDate]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getAutomationSeries(string $workspaceId, string $period = '7d'): array
    {
        $pdo = Connection::get();
        [$startDate] = $this->getPeriodDates($period);

        $stmt = $pdo->prepare("
            SELECT
                DATE(started_at) AS date,
                COUNT(*) AS total,
                COUNT(*) FILTER (WHERE status = 'completed') AS completed,
                COUNT(*) FILTER (WHERE status = 'failed') AS failed
            FROM automation_runs
            WHERE workspace_id = ? AND started_at >= ?
            GROUP BY DATE(started_at)
            ORDER BY date ASC
        ");
        $stmt->execute([$workspaceId, $startDate]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function getLeadPipeline(string $workspaceId): array
    {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("
            SELECT
                stage,
                COUNT(*) AS count,
                COALESCE(SUM(value), 0) AS total_value
            FROM leads
            WHERE workspace_id = ?
            GROUP BY stage
            ORDER BY CASE stage
                WHEN 'new'       THEN 1
                WHEN 'contacted' THEN 2
                WHEN 'qualified' THEN 3
                WHEN 'proposal'  THEN 4
                WHEN 'won'       THEN 5
                WHEN 'lost'      THEN 6
                ELSE 7
            END
        ");
        $stmt->execute([$workspaceId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getRecentActivity(string $workspaceId, int $limit = 20): array
    {
        $pdo  = Connection::get();
        $stmt = $pdo->prepare("
            SELECT al.*,
                u.name AS user_name
            FROM audit_logs al
            LEFT JOIN users u ON al.user_id = u.id
            WHERE al.workspace_id = ?
            ORDER BY al.created_at DESC
            LIMIT ?
        ");
        $stmt->execute([$workspaceId, $limit]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($rows as &$row) {
            if ($row['metadata']) {
                $row['metadata'] = json_decode($row['metadata'], true);
            }
        }

        return $rows;
    }

    public function getUsageSummary(string $workspaceId): array
    {
        $pdo    = Connection::get();
        $period = date('Y-m');

        $stmt = $pdo->prepare("
            SELECT metric, SUM(quantity) AS total
            FROM usage_records
            WHERE workspace_id = ? AND period = ?
            GROUP BY metric
        ");
        $stmt->execute([$workspaceId, $period]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $usage = [];
        foreach ($rows as $row) {
            $usage[$row['metric']] = (int) $row['total'];
        }

        // Fetch plan limits
        $planStmt = $pdo->prepare("
            SELECT p.limits_json
            FROM subscriptions s
            JOIN plans p ON s.plan_id = p.id
            WHERE s.workspace_id = ?
        ");
        $planStmt->execute([$workspaceId]);
        $planRow = $planStmt->fetch(PDO::FETCH_ASSOC);
        $limits  = $planRow ? json_decode($planRow['limits_json'], true) : [];

        return [
            'period'  => $period,
            'usage'   => $usage,
            'limits'  => $limits,
        ];
    }

    private function getPeriodDates(string $period): array
    {
        $days = match ($period) {
            '24h'  => 1,
            '7d'   => 7,
            '14d'  => 14,
            '30d'  => 30,
            '90d'  => 90,
            default => 7,
        };

        $startDate  = date('Y-m-d H:i:s', strtotime("-{$days} days"));
        $prevEnd    = date('Y-m-d H:i:s', strtotime("-{$days} days"));
        $prevStart  = date('Y-m-d H:i:s', strtotime("-" . ($days * 2) . " days"));

        return [$startDate, $prevStart, $prevEnd];
    }
}
