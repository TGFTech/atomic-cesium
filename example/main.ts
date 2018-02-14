import 'cesium-source/Widgets/widgets.css';

import { Viewer } from 'cesium';
import { Props, parseItemDesc, ComputationCache } from '../src/core';

const viewer = new Viewer('cesiumContainer');

// const iteDesc = parseItemDesc({
//     type: 'billboard',
//     img: () => './images/track.png',
//     position: (ctx) => ({
//         lat: ctx.position.lat,
//         lon: ctx.position.lon
//     })
// });

const itemDesc1 = parseItemDesc({
    type: 'amit_billboard',
    img: () => './images/track.png',
    position: {
        lat: (ctx) => ctx.position.lat,
        lon: (ctx) => ctx.position.lon
    }
});

const itemDesc2 = parseItemDesc({
    type: 'amit_billboard',
    img: () => './images/track.png',
    position: {
        lat: (ctx) => ctx.position.lat,
        lon: (ctx) => ctx.position.lon
    }
});

const itemDesc3 = parseItemDesc({
    type: 'amit_billboard',
    img: () => './images/track.png',
    position: {
        lat: (ctx) => 555,
        lon: (ctx) => 777
    }
});

const itemDesc = parseItemDesc({
    type: 'amit_billboard',
    img: () => './images/track.png',
    position: {
        lat: (ctx) => ctx.position.lat,
        lon: (ctx) => ctx.position.lon
    }
});

const asyncItemDesc = parseItemDesc({
    type: 'amit_billboard',
    img: async () => './images/track.png',
    position: {
        lat: async (ctx) => ctx.position.lat,
        lon: async (ctx) => ctx.position.lon
    }
});

const context = {
    img: 'aaaaaa',
    position: {
        lat: 32.345,
        lon: 36.455
    }
};

const billboard = {
    img: null,
    position: null
};

const assignResult = Props.assign(itemDesc, {}, context);
console.log('Assign result => ', assignResult);

const evaluateResult = Props.evaluate(itemDesc, context, new ComputationCache());
console.log('Evaluate result => ', evaluateResult);

const evaluateAsyncResult = Props.evaluateAsync(asyncItemDesc, context, new ComputationCache());
evaluateAsyncResult.then(desc => console.log('EvaluateAsync result => ', desc));

const executeResult = Props.execute(itemDesc, {}, context, new ComputationCache());
console.log('Execute result => ', executeResult);

const executeAsyncResult = Props.executeAsync(asyncItemDesc, {}, context, new ComputationCache());
executeAsyncResult.then(desc => console.log('ExecuteAsync result => ', desc));
