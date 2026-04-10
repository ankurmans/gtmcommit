import { describe, it, expect } from 'vitest';

// Test the TOOL_META configuration directly by importing the page module's data
// Since we can't easily import Next.js page components in tests, we test the structure

describe('Tool page enrichment', () => {
  const EXPECTED_TOOLS = ['claude_code', 'copilot', 'cursor', 'aider', 'windsurf', 'devin', 'lovable'];

  // Read the tool page file and verify structure
  it('all 7 tools should be defined', async () => {
    const fs = await import('fs');
    const content = fs.readFileSync('app/tools/[tool]/page.tsx', 'utf-8');

    for (const tool of EXPECTED_TOOLS) {
      expect(content).toContain(`${tool}:`);
    }
  });

  it('each tool should have spotlight content', async () => {
    const fs = await import('fs');
    const content = fs.readFileSync('app/tools/[tool]/page.tsx', 'utf-8');

    // Each tool should have spotlight section
    for (const tool of EXPECTED_TOOLS) {
      // Find the tool's section by looking for its key followed by spotlight
      const toolStart = content.indexOf(`${tool}: {`);
      expect(toolStart).toBeGreaterThan(-1);

      // Check spotlight exists after the tool key
      const afterTool = content.slice(toolStart, toolStart + 2000);
      expect(afterTool).toContain('spotlight:');
      expect(afterTool).toContain('headline:');
      expect(afterTool).toContain('body:');
      expect(afterTool).toContain('gtmUseCases:');
    }
  });

  it('each tool should have FAQ entries', async () => {
    const fs = await import('fs');
    const content = fs.readFileSync('app/tools/[tool]/page.tsx', 'utf-8');

    for (const tool of EXPECTED_TOOLS) {
      const toolStart = content.indexOf(`${tool}: {`);
      const afterTool = content.slice(toolStart, toolStart + 3000);
      expect(afterTool).toContain('faq:');
    }
  });

  it('page includes FAQ JSON-LD schema markup', async () => {
    const fs = await import('fs');
    const content = fs.readFileSync('app/tools/[tool]/page.tsx', 'utf-8');

    expect(content).toContain('application/ld+json');
    expect(content).toContain('@type');
    expect(content).toContain('FAQPage');
  });

  it('page includes cross-links to other tools', async () => {
    const fs = await import('fs');
    const content = fs.readFileSync('app/tools/[tool]/page.tsx', 'utf-8');

    expect(content).toContain('Explore Other Tools');
    expect(content).toContain('Explore by Role');
  });
});
