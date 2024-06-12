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
        const { data: teams } = yield octokit.rest.repos.listTeams({
            owner: inputs.owner,
            repo: inputs.repo
        });
        // 팀 목록에서 team_slug 가져오기
        const teamSlugs = teams.map(team => team.slug);
        // 팀들을 리뷰어로 PR에 추가하기
        yield Promise.all(teamSlugs.map((teamSlug) => __awaiter(this, void 0, void 0, function* () {
            yield octokit.rest.pulls.requestReviewers({
                owner: inputs.owner,
                repo: inputs.repo,
                pull_number: inputs.prNumber,
                team_reviewers: [teamSlug],
            });
            core.info(`Teams ${teamSlug} 를 reviewer 로 추가하였습니다.`);
            core.setOutput("dd", "dd");
        })));
        core.endGroup();
    });
}
exports.addReviewers = addReviewers;
//# sourceMappingURL=addReviewers.js.map