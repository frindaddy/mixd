const GlassTypes = [
    {name: 'collins', displayName: 'Collins'},
    {name: 'coupe', displayName: 'Coupe'},
    {name: 'fizz', displayName: 'Fizz'},
    {name: 'flute', displayName: 'Champagne Flute'},
    {name: 'margarita', displayName: 'Margarita'},
    {name: 'martini', displayName: 'Martini'},
    {name: 'mule', displayName: 'Mule'},
    {name: 'nickandnora', displayName: 'Nick & Nora'},
    {name: 'pilsner', displayName: 'Pilsner'},
    {name: 'pitcher', displayName: 'Pitcher'},
    {name: 'rocks', displayName: 'Rocks'},
    {name: 'shot', displayName: 'Shot'},
    {name: 'tiki', displayName: 'Tiki'},
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