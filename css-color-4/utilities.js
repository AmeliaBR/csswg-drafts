// utility functions for color conversions
// needs conversions.js and math.js (not Math)

function sRGB_to_luminance(RGB) {
    // convert an array of gamma-corrected sRGB values
    // in the 0.0 to 1.0 range
    // to linear-light sRGB, then to CIE XYZ
    // and return luminance (the Y value)

    var XYZ = lin_sRGB_to_XYZ(lin_sRGB(RGB));
    return XYZ[1];
}

function contrast(RGB1, RGB2) {
    // return WCAG 2.1 contrast ratio
    // https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
    // for two sRGB values
    // given as arrays of 0.0 to 1.0

    var L1 = sRGB_to_luminance(RGB1);
    var L2 = sRGB_to_luminance(RGB2);

    if (L1 > L2) return (L1 + 0.05) / (L2 + 0.05);
    return (L2 + 0.05) / (L1 + 0.05);
}

function sRGB_to_LCH(RGB) {
    // convert an array of gamma-corrected sRGB values
    // in the 0.0 to 1.0 range
    // to linear-light sRGB, then to CIE XYZ,
    // then adapt from D65 to D50,
    // then convert XYZ to CIE Lab
    // and finally, convert to CIE LCH

    return Lab_to_LCH(XYZ_to_Lab(D65_to_D50(lin_sRGB_to_XYZ(lin_sRGB(RGB)))));
}

function P3_to_LCH(RGB) {
    // convert an array of gamma-corrected display-p3 values
    // in the 0.0 to 1.0 range
    // to linear-light display-p3, then to CIE XYZ,
    // then adapt from D65 to D50,
    // then convert XYZ to CIE Lab
    // and finally, convert to CIE LCH

    return Lab_to_LCH(XYZ_to_Lab(D65_to_D50(lin_P3_to_XYZ(lin_P3(RGB)))));
}

function r2020_to_LCH(RGB) {
    // convert an array of gamma-corrected rec.2020 values
    // in the 0.0 to 1.0 range
    // to linear-light sRGB, then to CIE XYZ,
    // then adapt from D65 to D50,
    // then convert XYZ to CIE Lab
    // and finally, convert to CIE LCH

    return Lab_to_LCH(XYZ_to_Lab(D65_to_D50(lin_2020_to_XYZ(lin_2020(RGB)))));
}

function LCH_to_sRGB(LCH) {
    // convert an array of CIE LCH values
    // to CIE Lab, and then to XYZ,
    // adapt from D50 to D65,
    // then convert XYZ to linear-light sRGB
    // and finally to gamma corrected sRGB
    // for in-gamut colors, components are in the 0.0 to 1.0 range
    // out of gamut colors may have negative components
    // or components greater than 1.0
    // so check for that :)

    return gam_sRGB(XYZ_to_lin_sRGB(D50_to_D65(Lab_to_XYZ(LCH_to_Lab(LCH)))));
}

function LCH_to_P3(LCH) {
    // convert an array of CIE LCH values
    // to CIE Lab, and then to XYZ,
    // adapt from D50 to D65,
    // then convert XYZ to linear-light display-p3
    // and finally to gamma corrected display-p3
    // for in-gamut colors, components are in the 0.0 to 1.0 range
    // out of gamut colors may have negative components
    // or components greater than 1.0
    // so check for that :)

    return gam_P3(XYZ_to_lin_P3(D50_to_D65(Lab_to_XYZ(LCH_to_Lab(LCH)))));
}

function LCH_to_r2020(LCH) {
    // convert an array of CIE LCH values
    // to CIE Lab, and then to XYZ,
    // adapt from D50 to D65,
    // then convert XYZ to linear-light rec.2020
    // and finally to gamma corrected rec.2020
    // for in-gamut colors, components are in the 0.0 to 1.0 range
    // out of gamut colors may have negative components
    // or components greater than 1.0
    // so check for that :)

    return gam_2020(XYZ_to_lin_2020(D50_to_D65(Lab_to_XYZ(LCH_to_Lab(LCH)))));
}

// this is straight from the CSS Color 4 spec

function hslToRgb(hue, sat, light) {
    // 	For simplicity, this algorithm assumes that the hue has been normalized
    //  to a number in the half-open range [0, 6), and the saturation and lightness
    //  have been normalized to the range [0, 1]. It returns an array of three numbers
    //  representing the red, green, and blue channels of the colors,
    //  normalized to the range [0, 1]
    if( light <= .5 ) {
      var t2 = light * (sat + 1);
    } else {
      var t2 = light + sat - (light * sat);
    }
    var t1 = light * 2 - t2;
    var r = hueToRgb(t1, t2, hue + 2);
    var g = hueToRgb(t1, t2, hue);
    var b = hueToRgb(t1, t2, hue - 2);
    return [r,g,b];
  }

  function hueToRgb(t1, t2, hue) {
    if(hue < 0) hue += 6;
    if(hue >= 6) hue -= 6;

    if(hue < 1) return (t2 - t1) * hue + t1;
    else if(hue < 3) return t2;
    else if(hue < 4) return (t2 - t1) * (4 - hue) + t1;
    else return t1;
  }