fetch("https://api.github.com/repos/sebjohansson/keybearer")
  .then((response) => response.json())
  .then((data) => {
    console.log(data); // Prints result from `response.json()` in getRequest
  })
  .catch((error) => console.error(error));

fetch("https://api.github.com/repos/sebjohansson/personal")
  .then((response) => response.json())
  .then((data) => {
    console.log(data); // Prints result from `response.json()` in getRequest
  })
  .catch((error) => console.error(error));

const GITHUB_USERNAME = "sebjohansson";

async function fetchRepoDetails(repo) {
  const repoUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${repo}`;
  try {
    const repoResponse = await fetch(repoUrl);
    if (!repoResponse.ok) throw new Error("Failed to fetch repo data");
    const repoData = await repoResponse.json();

    const branch = repoData.default_branch;
    const commitUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${repo}/commits/${branch}`;
    const commitResponse = await fetch(commitUrl);
    if (!commitResponse.ok) throw new Error("Failed to fetch commit data");
    const commitData = await commitResponse.json();

    return {
      name: repoData.name,
      description: repoData.description,
      license: repoData.license?.spdx_id || "N/A",
      html_url: repoData.html_url,
      version: commitData.sha.substring(0, 7), // Short SHA
      updated: new Date(commitData.commit.author.date)
        .toISOString()
        .split("T")[0],
    };
  } catch (error) {
    console.error(`Error fetching data for ${repo}:`, error);
  }
}

function createProjectTable(details) {
  return `
    <tr>
      <td colspan="2" rowspan="2" class="width-auto">
        <h1 class="title">${details.name}</h1>
        <span class="subtitle">${details.description || "No description available"}</span>
      </td>
      <th>Version</th>
      <td class="width-min">${details.version}</td>
    </tr>
    <tr>
      <th>Updated</th>
      <td class="width-min">
        <time style="white-space: pre">${details.updated}</time>
      </td>
    </tr>
    <tr>
      <th class="width-min">Github</th>
      <td class="width-auto">
        <a href="${details.html_url}"><cite>Link</cite></a>
      </td>
      <th class="width-min">License</th>
      <td>${details.license}</td>
    </tr>
  `;
}

document.addEventListener("DOMContentLoaded", async () => {
  const tables = document.querySelectorAll("table.header[data-repo]");

  for (const table of tables) {
    const repo = table.dataset.repo;
    const details = await fetchRepoDetails(repo);
    if (details) {
      table.innerHTML = createProjectTable(details);
    }
  }
});
