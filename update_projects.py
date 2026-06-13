import os
import requests
import json
import sys

def fetch_github_repositories(username):
    """Fetches public repositories for the GitHub user."""
    url = f"https://api.github.com/users/{username}/repos?sort=updated&per_page=100"
    headers = {"Accept": "application/vnd.github.v3+json"}
    
    token = os.environ.get("PORTFOLIO_GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"token {token}"
        
    try:
        response = requests.get(url, headers=headers, timeout=15)
        if response.status_code != 200:
            print(f"Failed to fetch repos: HTTP {response.status_code}")
            sys.exit(1)
        return response.json()
    except Exception as e:
        print(f"Error connecting to GitHub API: {e}")
        sys.exit(1)

def transform_to_projects(repos):
    """Filters and transforms raw API data into a clean structure for the website."""
    projects = []
    ignored_repos = ["portfolio", "test"] 
    
    for repo in repos:
        if repo["fork"] or repo["private"] or repo["name"] in ignored_repos:
            continue
        if not repo["description"] and repo["stargazers_count"] == 0:
            continue

        project_entry = {
            "title": repo["name"].replace("-", " ").replace("_", " ").title(),
            "name": repo["name"],
            "description": repo["description"] or "An engineering project built using modern software architectures.",
            "tech_stack": [repo["language"]] if repo["language"] else ["Software Eng"],
            "github_url": repo["html_url"],
            "live_url": repo["homepage"] or "",
            "stars": repo["stargazers_count"],
            "updated_at": repo["updated_at"][:10]
        }
        projects.append(project_entry)
    return projects

if __name__ == "__main__":
    github_repository_owner = os.environ.get("GITHUB_REPOSITORY_OWNER")
    if not github_repository_owner:
        print("Error: GITHUB_REPOSITORY_OWNER environment variable not detected.")
        sys.exit(1)
        
    print(f"Gathering fresh project streams for developer: {github_repository_owner}...")
    raw_repos = fetch_github_repositories(github_repository_owner)
    formatted_projects = transform_to_projects(raw_repos)
    
    output_filename = "projects.json"
    with open(output_filename, "w", encoding="utf-8") as f:
        json.dump(formatted_projects, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully generated {len(formatted_projects)} items into {output_filename}!")