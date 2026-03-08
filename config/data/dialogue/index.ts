import anna from './round_1/anna.json'
import auntZhang from './round_1/aunt_zhang.json'
import michael from './round_1/michael.json'
import officerChan from './round_1/officer_chan.json'
import solutionIntro from './round_1/solution_intro.json'
import solutionOutro from './round_1/solution_outro.json'

const dialogues = {
  events: {
    ...anna,
    ...auntZhang,
    ...michael,
    ...officerChan,
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
