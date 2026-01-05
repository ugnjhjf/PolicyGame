import anna from './round_1/anna.json'
import auntZhang from './round_1/aunt_zhang.json'
import auntZhangInvestigate from '../investigate/round_1/aunt_zhang.json'
import michael from './round_1/michael.json'
import michaelInvestigate from '../investigate/round_1/michael.json'
import officerChan from './round_1/officer_chan.json'
import officerChanInvestigate from '../investigate/round_1/officer_chan.json'
import solutionIntro from '../solution/round_1/solution_intro.json'
import solutionOutro from '../solution/round_1/solution_outro.json'

const dialogues = {
  events: {
    ...anna,
    ...auntZhang,
    ...auntZhangInvestigate,
    ...michael,
    ...michaelInvestigate,
    ...officerChan,
    ...officerChanInvestigate,
    ...solutionIntro
  }
}

export default dialogues

export {
  anna as dialogue_intro,
  auntZhang as dialogue_aunt_zhang_start,
  michael as dialogue_michael_start,
  officerChan as dialogue_officer_chan,
  solutionIntro as dialogue_solution_intro,
  solutionOutro as dialogue_solution_outro
}
