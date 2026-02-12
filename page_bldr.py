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
        
        # Pattern to match: <div id="component_name">...any content...</div>
        # This will work for both empty divs and divs with existing content
        for component_id in self.component_map.keys():
            # Match opening div tag through closing div tag, capturing any content in between
            # This pattern handles:
            # - <div id="component_id"></div> (empty)
            # - <div id="component_id">...content...</div> (with content)
            # - <div id='component_id'> (single quotes)
            # - Whitespace variations
            pattern = rf'<div\s+id=["\']?{component_id}["\']?\s*>.*?</div>'
            
            component_html = self.load_component(component_id)
            replacement = f'<div id="{component_id}">\n{component_html}\n</div>'
            
            modified = re.sub(
                pattern,
                replacement,
                modified,
                flags=re.IGNORECASE | re.DOTALL  # DOTALL makes . match newlines too
            )
        
        return modified
    
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