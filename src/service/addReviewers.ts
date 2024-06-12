import * as core from '@actions/core'
import * as github from '@actions/github'
import {Inputs} from "../context";

export async function addReviewers(inputs: Inputs) {
    core.startGroup('AddReviewers');
    const octokit = github.getOctokit(inputs.token)

    const {data: teams} = await octokit.rest.repos.listTeams({
        owner: inputs.owner,
        repo: inputs.repo
    })

    // 팀 목록에서 team_slug 가져오기
    const teamSlugs = teams.map(team => team.slug);

    // 팀들을 리뷰어로 PR에 추가하기
    await Promise.all(
        teamSlugs.map(async teamSlug => {
            await octokit.rest.pulls.requestReviewers({
                owner: inputs.owner,
                repo: inputs.repo,
                pull_number: inputs.prNumber,
                team_reviewers: [teamSlug],
            });
            core.info(`Teams ${teamSlug} 를 reviewer 로 추가하였습니다.`)
            core.setOutput("dd", "dd")
        })
    );

    core.endGroup()
}