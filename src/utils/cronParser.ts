import {parseExpression} from 'cron-parser';

const parseCronsNextTs = function (crons: string[]): Date | null {
  if (!crons || crons.length === 0) {
    return null
  }
  try {
    let nextTs = parseExpression(crons[0], {tz: 'Asia/Shanghai'}).next().toDate()
    for (let i = 1; i < crons.length; i++) {
      if (!crons[i]) {
        throw new Error('Empty cron expression')
      }
      let tempNextTs = parseExpression(crons[i], {tz: 'Asia/Shanghai'}).next().toDate()
      if (tempNextTs < nextTs) {
        nextTs = tempNextTs
      }
    }
    return nextTs
  } catch (err) {
    // console.error(err);
    return null
  }
}

export default {
  parseCronsNextTs
}