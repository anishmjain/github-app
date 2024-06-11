import fetch from "node-fetch";

export const getUserProfileAndRepos = async (req, res) => {
    const { username } = req.params;
    try {
        // Log the token to verify it's being read correctly (remove this after debugging)
        console.log(`GitHub API Key: ${process.env.GITHUB_API_KEY}`);

        const userRes = await fetch(`https://api.github.com/users/${username}`, {
            headers: {
                authorization: `token ${process.env.GITHUB_API_KEY}`,
            },
        });

        if (!userRes.ok) {
            throw new Error(`GitHub User API responded with status: ${userRes.status}`);
        }

        const userProfile = await userRes.json();

        const repoRes = await fetch(userProfile.repos_url, {
            headers: {
                authorization: `token ${process.env.GITHUB_API_KEY}`,
            },
        });

        if (!repoRes.ok) {
            throw new Error(`GitHub Repos API responded with status: ${repoRes.status}`);
        }

        const repos = await repoRes.json();
        res.status(200).json({ userProfile, repos });
    } catch (error) {
        console.error(`Error fetching data for user: ${username}`, error);
        res.status(500).json({ error: error.message });
    }
}
