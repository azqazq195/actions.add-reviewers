import * as context from './context';
import {addReviewers} from "./service/addReviewers";

async function run(): Promise<void> {
    const inputs: context.Inputs = await context.getInputs();

    await addReviewers(inputs)
}


run().then(r => r);