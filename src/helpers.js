export const baseAbilityScoreModifier = (ability) => Math.floor((ability - 10) / 2)

const cr_proficiency_bonus = {
    '0': 2,
    '0.125': 2, // 1/8
    '0.25': 2, // 1/4
    '0.5': 2,
    '1': 2,
    '2': 2,
    '3': 2,
    '4': 2,
    '5': 3,
    '6': 3,
    '7': 3,
    '8': 3,
    '9': 4,
    '10': 4,
    '11': 4,
    '12': 4,
    '13': 5,
    '14': 5,
    '15': 5,
    '16': 5,
    '17': 6,
    '18': 6,
    '19': 6,
    '20': 6,
    '21': 7,
    '22': 7,
    '23': 7,
    '24': 7,
    '25': 8,
    '26': 8,
    '27': 8,
    '28': 8,
    '29': 9,
    '30': 9
}

export const mapProficiencyBonus = (challengeRating) => cr_proficiency_bonus[challengeRating]

export const exportToJson = (data, fileName = 'export') => {
    let filename = `${fileName}.json`
    let contentType = "application/json;charset=utf-8;"
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        var blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(data)))], { type: contentType });
        navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        var a = document.createElement('a');
        a.download = filename;
        a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(data));
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}