export function getMonday(d) {
    d = new Date(d);
    d.setHours(3);
    d.setMinutes(0, 0, 0);

    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

export function getSunday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? 0 : 7);
    return new Date(d.setDate(diff));
}

export function getWeekRange() {
    return {
        from: getMonday(new Date()),
        to: getSunday(new Date()),
    };
} 