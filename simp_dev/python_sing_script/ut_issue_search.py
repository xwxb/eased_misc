import requests
from datetime import datetime, timedelta
# 使用GitHub的搜索API搜索star在1k以上的golang项目
url = "https://api.github.com/search/repositories?q=language:go stars:>6000"
response = requests.get(url)
repos = response.json()['items']

# 对于每个搜索结果，获取该项目的所有issue
for repo in repos:
    issues_url = f"https://api.github.com/repos/{repo['full_name']}/issues"
    issues_response = requests.get(issues_url)
    issues = issues_response.json()

    # todo 未完成，问题是issues不是一个字典，而是一个string列表
    # 对于每个issue，检查其描述是否包含"unit test"、"testing"、"tests"等关键词
    if isinstance(issues, dict):  # Add a check to ensure issues is a dictionary
        for issue in issues.values():
            created_at = datetime.strptime(issue['created_at'], "%Y-%m-%dT%H:%M:%SZ")
            three_months_ago = datetime.now() - timedelta(days=90)
            if created_at >= three_months_ago and ("unit test" in issue['title'].lower() or "unit test" in issue['body'].lower()) and ("labels" in issue and ("good first issue" in issue['labels'] or "help wanted" in issue['labels'])):
                print(f"Found a unit test issue in repo {repo['full_name']}: {issue['html_url']}")
