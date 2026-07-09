export interface ThemeState {
  colors: {
    primary: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
    border: string;
    accent?: string;
  };
  typography: {
    fontFamily: string;
    headingFont: string;
    bodySize: string;
    headingSize: string;
    bodyWeight: string;
    headingWeight: string;
  };
  layout: {
    radius: string;
    borderStyle?: string;
    animationStyle?: 'joyrush' | 'k95' | 'juliencalot' | 'depoluxe' | 'monolog' | 'hildenkaira' | 'radian' | 'avantgarde' | 'cyber' | 'metropolitan' | 'default';
    cursorStyle?: 'dot' | 'bubble' | 'invert' | 'crosshair' | 'none' | 'default';
  };
}

export const presets: Record<string, ThemeState> = {
  Default: {
    colors: {
      primary: '#2563EB',
      background: '#FAFAFA',
      surface: '#FFFFFF',
      text: '#09090B',
      muted: '#71717A',
      border: '#E4E4E7',
    },
    typography: {
      fontFamily: 'Space Grotesk, sans-serif',
      headingFont: 'Space Grotesk, sans-serif',
      bodySize: '16px',
      headingSize: '48px',
      bodyWeight: '400',
      headingWeight: '700',
    },
    layout: {
      radius: '1rem',
      animationStyle: 'default',
      cursorStyle: 'default',
    }
  },
  'Joy Rush (drinkjoyrush.com)': {
    colors: {
      primary: '#FF5C8A',
      background: '#FFF3F6',
      surface: '#FFE6EC',
      text: '#2C0E1E',
      muted: '#8A6878',
      border: '#FFA3B1',
      accent: '#38BDF8',
    },
    typography: {
      fontFamily: 'Sora, sans-serif',
      headingFont: 'Fredoka, sans-serif',
      bodySize: '16px',
      headingSize: '54px',
      bodyWeight: '400',
      headingWeight: '700',
    },
    layout: {
      radius: '2rem',
      borderStyle: '3px solid #2C0E1E',
      animationStyle: 'joyrush',
      cursorStyle: 'bubble',
    }
  },
  'K95 Minimal (k95.it)': {
    colors: {
      primary: '#0D0D0D',
      background: '#F4F4F4',
      surface: '#FFFFFF',
      text: '#0F0F0F',
      muted: '#7A7A7A',
      border: '#1A1A1A',
    },
    typography: {
      fontFamily: 'Space Mono, monospace',
      headingFont: 'Space Mono, monospace',
      bodySize: '14px',
      headingSize: '42px',
      bodyWeight: '400',
      headingWeight: '700',
    },
    layout: {
      radius: '0px',
      borderStyle: '1px solid #1A1A1A',
      animationStyle: 'k95',
      cursorStyle: 'dot',
    }
  },
  'Julien Calot Art (juliencalot.com)': {
    colors: {
      primary: '#FF2A54',
      background: '#0B0A0F',
      surface: '#15131C',
      text: '#FAF9FC',
      muted: '#A59EB5',
      border: '#3F394C',
    },
    typography: {
      fontFamily: 'Satoshi, sans-serif',
      headingFont: 'Fraunces, serif',
      bodySize: '16px',
      headingSize: '60px',
      bodyWeight: '400',
      headingWeight: '600',
    },
    layout: {
      radius: '1.25rem',
      animationStyle: 'juliencalot',
      cursorStyle: 'invert',
    }
  },
  'Depoluxe (depoluxe.xyz)': {
    colors: {
      primary: '#D4AF37',
      background: '#0E0F11',
      surface: '#181A1F',
      text: '#EAEAEA',
      muted: '#808590',
      border: '#2C2F36',
    },
    typography: {
      fontFamily: 'Cinzel, serif',
      headingFont: 'Cinzel, serif',
      bodySize: '15px',
      headingSize: '48px',
      bodyWeight: '400',
      headingWeight: '800',
    },
    layout: {
      radius: '0px',
      borderStyle: '1px solid #2C2F36',
      animationStyle: 'depoluxe',
      cursorStyle: 'crosshair',
    }
  },
  'Monolog Editorial (bymonolog.com)': {
    colors: {
      primary: '#4D4137',
      background: '#FAF6F0',
      surface: '#FDFBF7',
      text: '#221D1A',
      muted: '#7C7067',
      border: '#E8E1D7',
    },
    typography: {
      fontFamily: 'Instrument Serif, serif',
      headingFont: 'Cormorant Garamond, serif',
      bodySize: '17px',
      headingSize: '56px',
      bodyWeight: '400',
      headingWeight: '300',
    },
    layout: {
      radius: '0.75rem',
      animationStyle: 'monolog',
      cursorStyle: 'default',
    }
  },
  'Hilden Kaira (hildenkaira.fi)': {
    colors: {
      primary: '#2B4A3F',
      background: '#F9F8F6',
      surface: '#EFEFEA',
      text: '#1C2924',
      muted: '#63726B',
      border: '#D8D8CF',
    },
    typography: {
      fontFamily: 'Outfit, sans-serif',
      headingFont: 'Outfit, sans-serif',
      bodySize: '16px',
      headingSize: '46px',
      bodyWeight: '300',
      headingWeight: '600',
    },
    layout: {
      radius: '0.5rem',
      borderStyle: '1px solid #D8D8CF',
      animationStyle: 'hildenkaira',
      cursorStyle: 'dot',
    }
  },
  'Radian (rideradian.com)': {
    colors: {
      primary: '#CCFF00',
      background: '#050505',
      surface: '#111111',
      text: '#FFFFFF',
      muted: '#888888',
      border: '#222222',
      accent: '#CCFF00',
    },
    typography: {
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      headingFont: 'Anton, sans-serif',
      bodySize: '15px',
      headingSize: '72px',
      bodyWeight: '500',
      headingWeight: '900',
    },
    layout: {
      radius: '4px',
      borderStyle: '2px solid #222222',
      animationStyle: 'radian',
      cursorStyle: 'dot',
    }
  },
  'Avant-Garde (Awwwards)': {
    colors: {
      primary: '#8B5CF6',
      background: '#0B0914',
      surface: '#161224',
      text: '#F5F3FF',
      muted: '#A78BFA',
      border: '#342A5C',
    },
    typography: {
      fontFamily: 'Syne, sans-serif',
      headingFont: 'Syne, sans-serif',
      bodySize: '16px',
      headingSize: '64px',
      bodyWeight: '400',
      headingWeight: '800',
    },
    layout: {
      radius: '1.5rem',
      animationStyle: 'avantgarde',
      cursorStyle: 'invert',
    }
  },
  'Retro Cyber (Awwwards)': {
    colors: {
      primary: '#00FF66',
      background: '#080C0A',
      surface: '#0F1813',
      text: '#E0FFE8',
      muted: '#52A36B',
      border: '#153321',
    },
    typography: {
      fontFamily: 'JetBrains Mono, monospace',
      headingFont: 'Unbounded, sans-serif',
      bodySize: '14px',
      headingSize: '40px',
      bodyWeight: '450',
      headingWeight: '800',
    },
    layout: {
      radius: '0px',
      borderStyle: '1px solid #153321',
      animationStyle: 'cyber',
      cursorStyle: 'crosshair',
    }
  },
  'Metropolitan Luxe (Awwwards)': {
    colors: {
      primary: '#AF956B',
      background: '#0A0C10',
      surface: '#12161E',
      text: '#F1ECE4',
      muted: '#929B9C',
      border: '#282E3B',
    },
    typography: {
      fontFamily: 'Cinzel, serif',
      headingFont: 'Playfair Display, serif',
      bodySize: '15px',
      headingSize: '50px',
      bodyWeight: '300',
      headingWeight: '700',
    },
    layout: {
      radius: '8px',
      animationStyle: 'metropolitan',
      cursorStyle: 'invert',
    }
  }
};
