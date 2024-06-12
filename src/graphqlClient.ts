import * as context from './context';
import {graphql} from '@octokit/graphql'

export async function getGraphqlClient() {
    const inputs = await context.getInputs();
    return graphql.defaults({
        headers: {
            authorization: `token ${inputs.token}`
        }
    });
}
