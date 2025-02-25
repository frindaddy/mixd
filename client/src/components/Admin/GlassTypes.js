const GlassTypes = [
    {name: 'collins', displayName: 'Collins'},
    {name: 'coupe', displayName: 'Coupe'},
    {name: 'fizz', displayName: 'Fizz'},
    {name: 'flute', displayName: 'Champagne Flute'},
    {name: 'hurricane', displayName: 'Hurricane'},
    {name: 'irish-coffee', displayName: 'Irish Coffee'},
    {name: 'julep', displayName: 'Julep'},
    {name: 'margarita', displayName: 'Margarita'},
    {name: 'martini', displayName: 'Martini'},
    {name: 'mule', displayName: 'Mule'},
    {name: 'nickandnora', displayName: 'Nick & Nora'},
    {name: 'pilsner', displayName: 'Pilsner'},
    {name: 'pitcher', displayName: 'Pitcher'},
    {name: 'rocks', displayName: 'Rocks'},
    {name: 'shaker', displayName: 'Shaker'},
    {name: 'shot', displayName: 'Shot'},
    {name: 'snifter', displayName: 'Snifter'},
    {name: 'stein', displayName: 'Stein'},
    {name: 'tiki', displayName: 'Tiki'},
    {name: 'toddy', displayName: 'Toddy'},
    {name: 'wine', displayName: 'Wine'},
];

export default GlassTypes;
export function getDisplayName(name){
    let glass = GlassTypes.filter((type) => type.name === name)[0];
    if (glass) {
        return glass.displayName;
    } else {
        return null;
    }
}