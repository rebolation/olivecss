// ========================================
// CLI 유틸리티 클래스들
// ========================================

// ---------------------------------------------
// 색상 유틸리티 클래스
// ---------------------------------------------

export class ColorUtility {
  static colors = {
    // 스타일
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    italic: '\x1b[3m',
    underline: '\x1b[4m',
    blink: '\x1b[5m',
    reverse: '\x1b[7m',
    hidden: '\x1b[8m',
    strikethrough: '\x1b[9m',
    
    // 기본 전경색
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    
    // 밝은 전경색
    brightBlack: '\x1b[90m',
    brightRed: '\x1b[91m',
    brightGreen: '\x1b[92m',
    brightYellow: '\x1b[93m',
    brightBlue: '\x1b[94m',
    brightMagenta: '\x1b[95m',
    brightCyan: '\x1b[96m',
    brightWhite: '\x1b[97m',
    
    // 기본 배경색
    bgBlack: '\x1b[40m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
    bgWhite: '\x1b[47m',
    
    // 밝은 배경색
    bgBrightBlack: '\x1b[100m',
    bgBrightRed: '\x1b[101m',
    bgBrightGreen: '\x1b[102m',
    bgBrightYellow: '\x1b[103m',
    bgBrightBlue: '\x1b[104m',
    bgBrightMagenta: '\x1b[105m',
    bgBrightCyan: '\x1b[106m',
    bgBrightWhite: '\x1b[107m'
  };

  highlight(text, color = 'yellow') {
    return `${ColorUtility.colors[color]}${text}${ColorUtility.colors.reset}`;
  }

  highlightError(text) {
    return this.highlight(text, 'red');
  }

  // 추가 색상 메서드들
  highlightWarning(text) {
    return this.highlight(text, 'brightYellow');
  }

  highlightInfo(text) {
    return this.highlight(text, 'brightBlue');
  }

  highlightSuccess(text) {
    return this.highlight(text, 'brightGreen');
  }

  highlightFile(text) {
    return this.highlight(text, 'green');
  }

  highlightPath(text) {
    return this.highlight(text, 'brightMagenta');
  }

  highlightCommand(text) {
    return this.highlight(text, 'brightWhite');
  }

  highlightPort(text) {
    return this.highlight(text, 'brightGreen');
  }

  highlightUrl(text) {
    return this.highlight(text, 'brightBlue');
  }

  highlightStatus(text) {
    return this.highlight(text, 'brightYellow');
  }

  highlightFade(text) {
    return this.highlight(text, 'brightBlack');
  }  

  // 스타일 조합 메서드들
  highlightBold(text, color = 'white') {
    return `${ColorUtility.colors.bright}${ColorUtility.colors[color]}${text}${ColorUtility.colors.reset}`;
  }

  highlightUnderline(text, color = 'white') {
    return `${ColorUtility.colors.underline}${ColorUtility.colors[color]}${text}${ColorUtility.colors.reset}`;
  }

  highlightBoldUnderline(text, color = 'white') {
    return `${ColorUtility.colors.bright}${ColorUtility.colors.underline}${ColorUtility.colors[color]}${text}${ColorUtility.colors.reset}`;
  }

  // 배경색과 조합
  highlightWithBg(text, fgColor = 'white', bgColor = 'bgBlack') {
    return `${ColorUtility.colors[fgColor]}${ColorUtility.colors[bgColor]}${text}${ColorUtility.colors.reset}`;
  }

  // 특별한 용도의 하이라이트
  highlightOlive(text) {
    return this.highlightWithBg(text, 'brightGreen', 'bgBlack');
  }

  highlightServer(text) {
    return this.highlightWithBg(text, 'brightCyan', 'bgBlack');
  }

  highlightErrorBold(text) {
    return this.highlightBold(text, 'brightRed');
  }

  highlightSuccessBold(text) {
    return this.highlightBold(text, 'brightGreen');
  }
}
