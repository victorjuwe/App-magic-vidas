import sys
import urllib.request
import re
import urllib.parse

def search_myinstants(query):
    encoded_query = urllib.parse.quote(query)
    url = f"https://www.myinstants.com/en/search/?name={encoded_query}"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            # Extract play('path/to/sound.mp3') or similar patterns
            # MyInstants button contains: play('/media/sounds/xxx.mp3', 'xxx')
            pattern = r"play\('([^']+)'"
            matches = re.findall(pattern, html)
            
            # Also extract the name of the sound
            # The HTML usually has: <a class="instant-link" href="...">Name of Sound</a>
            name_pattern = r'<a class="instant-link"[^>]*>([^<]+)</a>'
            names = re.findall(name_pattern, html)
            
            results = []
            for i, match in enumerate(matches):
                full_url = f"https://www.myinstants.com{match}" if match.startswith('/') else f"https://www.myinstants.com/{match}"
                name = names[i] if i < len(names) else "Unknown"
                results.append((name.strip(), full_url))
            
            return results
    except Exception as e:
        print(f"Error searching for '{query}': {e}")
        return []

if __name__ == '__main__':
    query = sys.argv[1] if len(sys.argv) > 1 else "bleach"
    print(f"Searching for: {query}...")
    sounds = search_myinstants(query)
    for name, url in sounds[:10]:
        print(f"- {name}: {url}")
