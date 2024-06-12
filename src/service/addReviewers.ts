import * as core from '@actions/core'
import * as github from '@actions/github'
import {Inputs} from "../context";

export async function addReviewers(inputs: Inputs) {
    core.startGroup('AddReviewers');
    const octokit = github.getOctokit(inputs.token)

    // 리포지토리의 모든 팀 가져오기
    const {data: teams} = await octokit.rest.repos.listTeams({
        owner: inputs.owner,
        repo: inputs.repo
    });

    // 각 팀의 멤버 목록 가져오기
    for (const team of teams) {
        const {data: members} = await octokit.rest.teams.listMembersInOrg({
            org: inputs.owner,
            team_slug: team.slug,
        });

        // 자신을 제외한 팀 멤버 목록
        const reviewers = members
            .map(member => member.login)
            .filter(member => member !== inputs.username);

        // 리뷰어로 팀 멤버 추가
        if (reviewers.length > 0) {
            await octokit.rest.pulls.requestReviewers({
                owner: inputs.owner,
                repo: inputs.repo,
                pull_number: inputs.prNumber,
                reviewers: reviewers,
            });
            core.info(`팀 ${team.slug} 멤버들을 리뷰어로 추가했습니다: ${reviewers.join(', ')}`);
        } else {
            core.info(`팀 ${team.slug} 에 자신 이외에 추가할 리뷰어가 없습니다.`);
        }
    }

    core.endGroup()
}