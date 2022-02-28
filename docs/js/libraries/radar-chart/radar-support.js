// Original code from https://stackoverflow.com/a/24569190
// Updated by Sudharsan to generate sector arcs with defined angles

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

function describeArc(x, y, innerRadius, outerRadius, startAngle, endAngle){
    var innerStart = polarToCartesian(x, y, innerRadius, startAngle);
    var innerEnd = polarToCartesian(x, y, innerRadius, endAngle);
    var outerStart = polarToCartesian(x, y, outerRadius, endAngle);
    var outerEnd = polarToCartesian(x, y, outerRadius, startAngle);

    var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
    var clockwiseSweep = 1;
    var antiClockwiseSweep = 0;

    var d = [
        "M", innerStart.x, innerStart.y, 
        "A", innerRadius, innerRadius, 0, arcSweep, clockwiseSweep, innerEnd.x, innerEnd.y,
        "L", outerStart.x, outerStart.y,
        "A", outerRadius, outerRadius, 0, arcSweep, antiClockwiseSweep, outerEnd.x, outerEnd.y,
        "L", innerStart.x, innerStart.y
    ].join(" ");

    return d;       
}