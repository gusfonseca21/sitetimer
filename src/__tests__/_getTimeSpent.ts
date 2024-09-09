import getTimeSpent from '../helper/getTimeSpent';

test('getTimeSpent: ', () => {
  expect(getTimeSpent(Date.now())).toBe(0);
});
