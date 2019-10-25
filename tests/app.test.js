const { init, submitListener } = require('../src/client/js/app');

test('test init', ()=>{
    document.body.innerHTML = `<div id="startDateInput"></div><div id="endDateInput"></div>`;
    expect(init()).toBe(true);
});