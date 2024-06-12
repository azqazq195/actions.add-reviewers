"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addReviewers = void 0;
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
function addReviewers(inputs) {
    return __awaiter(this, void 0, void 0, function* () {
        core.startGroup('AddReviewers');
        const octokit = github.getOctokit(inputs.token);
        // 리포지토리의 모든 팀 가져오기
        const { data: teams } = yield octokit.rest.repos.listTeams({
            owner: inputs.owner,
            repo: inputs.repo
        });
        // 각 팀의 멤버 목록 가져오기
        for (const team of teams) {
            const { data: members } = yield octokit.rest.teams.listMembersInOrg({
                org: inputs.owner,
                team_slug: team.slug,
            });
            // 자신을 제외한 팀 멤버 목록
            const reviewers = members
                .map(member => member.login)
                .filter(member => member !== inputs.username);
            // 리뷰어로 팀 멤버 추가
            if (reviewers.length > 0) {
                yield octokit.rest.pulls.requestReviewers({
                    owner: inputs.owner,
                    repo: inputs.repo,
                    pull_number: inputs.prNumber,
                    reviewers: reviewers,
                });
                core.info(`팀 ${team.slug} 멤버들을 리뷰어로 추가했습니다: ${reviewers.join(', ')}`);
            }
            else {
                core.info(`팀 ${team.slug} 에 자신 이외에 추가할 리뷰어가 없습니다.`);
            }
        }
        core.endGroup();
    });
}
exports.addReviewers = addReviewers;
//# sourceMappingURL=addReviewers.js.map