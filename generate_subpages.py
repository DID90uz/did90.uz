import os
import re

def main():
    root_dir = "/Users/Siroj/WORK/DID90"
    index_path = os.path.join(root_dir, "index.html")
    
    if not os.path.exists(index_path):
        print(f"Error: index.html not found at {index_path}")
        return

    with open(index_path, "r", encoding="utf-8") as f:
        index_content = f.read()

    # Extract header
    header_match = re.search(r"<header>.*?</header>", index_content, re.DOTALL)
    if not header_match:
        print("Error: <header> not found in index.html")
        return
    header_template = header_match.group(0)

    # Extract footer
    footer_match = re.search(r"<footer id=\"main-footer\">.*?</footer>", index_content, re.DOTALL)
    if not footer_match:
        # Fallback to general footer
        footer_match = re.search(r"<footer>.*?</footer>", index_content, re.DOTALL)
    if not footer_match:
        print("Error: <footer> not found in index.html")
        return
    footer_template = footer_match.group(0)

    # Clean active nav link from header template
    header_template = header_template.replace('class="active"', '')
    header_template = header_template.replace("class='active'", '')

    # Prepare depth-aware versions (specifically depth of 2, i.e., ../../)
    prefix = "../../"
    
    def make_depth_aware(html):
        # We need to prepend prefix to root-relative links in our header/footer:
        # e.g., href="index.html" -> href="../../index.html"
        # e.g., href="about.html" -> href="../../about.html"
        # e.g., href="services.html" -> href="../../services.html"
        # e.g., href="work.html" -> href="../../work.html"
        # e.g., href="pricing.html" -> href="../../pricing.html"
        # e.g., href="blog.html" -> href="../../blog.html"
        # e.g., href="contact.html" -> href="../../contact.html"
        pages = ["index.html", "about.html", "services.html", "work.html", "pricing.html", "blog.html", "contact.html"]
        result = html
        for page in pages:
            # Match href="page" or href='page' but not absolute or already relative ones
            result = re.sub(rf'href=["\']{page}["\']', f'href="{prefix}{page}"', result)
        return result

    subpage_header = make_depth_aware(header_template)
    subpage_footer = make_depth_aware(footer_template)

    # Directories to process
    subfolders = ["work", "blog", "legals"]
    updated_count = 0

    for folder in subfolders:
        folder_path = os.path.join(root_dir, folder)
        if not os.path.exists(folder_path):
            continue
            
        for root, dirs, files in os.walk(folder_path):
            for file in files:
                if file == "index.html":
                    filepath = os.path.join(root, file)
                    
                    with open(filepath, "r", encoding="utf-8") as f:
                        content = f.read()

                    # Replace header
                    content = re.sub(r"<header>.*?</header>", subpage_header, content, flags=re.DOTALL)

                    # Replace footer
                    content = re.sub(r"<footer id=\"main-footer\">.*?</footer>", subpage_footer, content, flags=re.DOTALL)
                    content = re.sub(r"<footer>.*?</footer>", subpage_footer, content, flags=re.DOTALL)

                    # Fix scripts at the bottom:
                    # Replace src="cms-core.js" with src="../../cms-core.js"
                    # Replace src="app.js" with src="../../app.js"
                    # Handle both double/single quotes and dynamic variations
                    content = re.sub(r'src=["\']cms-core\.js["\']', f'src="{prefix}cms-core.js"', content)
                    content = re.sub(r'src=["\']app\.js["\']', f'src="{prefix}app.js"', content)

                    # Make sure the stylesheet link is also correct
                    content = re.sub(r'href=["\']styles\.css["\']', f'href="{prefix}styles.css"', content)

                    with open(filepath, "w", encoding="utf-8") as f:
                        f.write(content)
                    
                    print(f"Updated: {filepath}")
                    updated_count += 1

    print(f"Successfully updated {updated_count} subpages!")

if __name__ == "__main__":
    main()
