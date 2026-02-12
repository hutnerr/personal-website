#!/usr/bin/env python3
"""
Static Site Builder - Inlines HTML components into pages
Replaces dynamic component loading with static HTML for faster page loads
"""

import os
import re
from pathlib import Path
from typing import Dict, List

class StaticSiteBuilder:
    def __init__(self, root_dir: str = '.'):
        self.root_dir = Path(root_dir)
        self.components_dir = self.root_dir / 'components'
        self.component_cache: Dict[str, str] = {}
        
        # Component mapping: div id -> component file
        self.component_map = {
            'background': 'background.html',
            'header': 'header.html',
            'footer': 'footer.html'
        }
    
    def load_component(self, component_name: str) -> str:
        """Load component HTML from file and cache it"""
        if component_name in self.component_cache:
            return self.component_cache[component_name]
        
        component_file = self.components_dir / self.component_map[component_name]
        
        if not component_file.exists():
            print(f"Warning: Component file not found: {component_file}")
            return ''
        
        with open(component_file, 'r', encoding='utf-8') as f:
            content = f.read().strip()
        
        self.component_cache[component_name] = content
        return content
    
    def process_html(self, html_content: str) -> str:
        """Replace component div placeholders with actual component HTML"""
        modified = html_content
        
        for component_id in self.component_map.keys():
            component_html = self.load_component(component_id)
            
            # Find the component div and replace its entire content
            # We need to handle nested divs properly
            modified = self._replace_component_div(modified, component_id, component_html)
        
        return modified
    
    def _replace_component_div(self, html: str, component_id: str, new_content: str) -> str:
        """Replace a component div handling nested tags properly"""
        # Find opening tag: <div id="component_id">
        opening_pattern = rf'<div\s+id=["\']?{component_id}["\']?\s*>'
        opening_match = re.search(opening_pattern, html, re.IGNORECASE)
        
        if not opening_match:
            return html  # Component div not found
        
        start_pos = opening_match.end()
        
        # Now find the matching closing </div> by counting nested divs
        depth = 1
        pos = start_pos
        
        while pos < len(html) and depth > 0:
            # Look for next opening or closing div
            next_open = html.find('<div', pos)
            next_close = html.find('</div>', pos)
            
            # If no more closing tags, something is wrong
            if next_close == -1:
                return html
            
            # Check which comes first
            if next_open != -1 and next_open < next_close:
                # Found nested opening div
                depth += 1
                pos = next_open + 4
            else:
                # Found closing div
                depth -= 1
                if depth == 0:
                    # This is our matching closing tag
                    end_pos = next_close
                    break
                pos = next_close + 6
        
        # Replace everything between opening and closing tag
        before = html[:opening_match.start()]
        after = html[end_pos + 6:]  # +6 for </div>
        
        replacement = f'<div id="{component_id}">\n{new_content}\n</div>'
        
        return before + replacement + after
    
    def remove_component_loader_script(self, html_content: str) -> str:
        """Remove the component loading JavaScript since it's no longer needed"""
        # Remove script tags containing the component loader code
        # This looks for script tags with the loadComponent function
        pattern = r'<script[^>]*>[\s\S]*?loadComponent[\s\S]*?</script>'
        modified = re.sub(pattern, '', html_content, flags=re.IGNORECASE)
        return modified
    
    def find_html_files(self) -> List[Path]:
        """Find all HTML files in the root directory (not in subdirectories like components/)"""
        html_files = []
        
        # Look for HTML files in root and immediate subdirectories
        # but exclude the components directory
        for html_file in self.root_dir.rglob('*.html'):
            # Skip if in components directory
            if 'components' in html_file.parts:
                continue
            html_files.append(html_file)
        
        return html_files
    
    def process_file(self, file_path: Path) -> bool:
        """Process a single HTML file"""
        try:
            print(f"Processing: {file_path.relative_to(self.root_dir)}")
            
            with open(file_path, 'r', encoding='utf-8') as f:
                original_content = f.read()
            
            # Process the HTML
            modified_content = self.process_html(original_content)
            modified_content = self.remove_component_loader_script(modified_content)
            
            # Only write if content changed
            if modified_content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(modified_content)
                print(f"  ✓ Updated")
                return True
            else:
                print(f"  - No changes needed")
                return False
                
        except Exception as e:
            print(f"  ✗ Error processing {file_path}: {e}")
            return False
    
    def build(self):
        """Build all static pages"""
        print("=" * 60)
        print("Static Site Builder - Inlining Components")
        print("=" * 60)
        
        # Check if components directory exists
        if not self.components_dir.exists():
            print(f"Error: Components directory not found: {self.components_dir}")
            return
        
        print(f"\nRoot directory: {self.root_dir.absolute()}")
        print(f"Components directory: {self.components_dir.absolute()}")
        
        # Find all HTML files
        html_files = self.find_html_files()
        
        if not html_files:
            print("\nNo HTML files found to process")
            return
        
        print(f"\nFound {len(html_files)} HTML file(s) to process\n")
        
        # Process each file
        updated_count = 0
        for html_file in html_files:
            if self.process_file(html_file):
                updated_count += 1
        
        print("\n" + "=" * 60)
        print(f"Build complete: {updated_count}/{len(html_files)} file(s) updated")
        print("=" * 60)


if __name__ == '__main__':
    import sys
    
    # Allow specifying root directory as command line argument
    root_dir = sys.argv[1] if len(sys.argv) > 1 else '.'
    
    builder = StaticSiteBuilder(root_dir)
    builder.build()