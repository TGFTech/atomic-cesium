const map = MapsFactory.create({});

const layer = map.createLayer({
    id: 'tracks',
    show: true,
    priority: 1000
});

layer.render();

const entity = layer.createEntity({
    data: {},
    id: '1233244',
    ttl: 100000,
    show: () => true,
    priority: () => 100,
    items: [
        {
            type: 'global',
            position: ctx => ctx.getPosition()
        },
        {
            type: 'label',
            text: ctx => ctx.getName(),
        },
        {
            type: 'billboard',
            img: ctx => ctx.getImgUrl()
        }
    ]
});

entity.addItem({
    type: 'billboard',
    img: ctx => ctx.getMainImgUrl()
});

entity.render({});

entity.destroy();