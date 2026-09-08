<?php

declare(strict_types=1);

namespace App\Tests;

use PHPUnit\Framework\TestCase;
use App\Services\VariableResolver;

final class VariableResolverTest extends TestCase
{
    public function testResolvesVariablesSuccessfully(): void
    {
        $template = "🔥 {{product.name}}\n💰 \${{product.price}}\n📦 Only {{product.stock}} left!\nHello {{customer.name}}!";
        $context = [
            'customer' => ['name' => 'Sophia'],
            'product'  => ['name' => 'Artisan Teapot', 'price' => 120, 'stock' => 4],
        ];

        $output = VariableResolver::resolve($template, $context);

        $this->assertStringContainsString('🔥 Artisan Teapot', $output);
        $this->assertStringContainsString('💰 $120', $output);
        $this->assertStringContainsString('📦 Only 4 left!', $output);
        $this->assertStringContainsString('Hello Sophia!', $output);
    }

    public function testKeepsUnmatchedVariablesIntact(): void
    {
        $template = "Special offer for {{customer.name}} on {{unknown.field}}";
        $context = ['customer' => ['name' => 'Kenji']];

        $output = VariableResolver::resolve($template, $context);
        $this->assertEquals("Special offer for Kenji on {{unknown.field}}", $output);
    }
}
