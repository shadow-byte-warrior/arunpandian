export interface ThemeState {
  colors: {
    primary: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
    border: string;
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
    }
  },
  Cyberpunk: {
    colors: {
      primary: '#FCE22A',
      background: '#0D0E15',
      surface: '#151623',
      text: '#E2E8F0',
      muted: '#94A3B8',
      border: '#2DD4BF',
    },
    typography: {
      fontFamily: 'Orbitron, sans-serif',
      headingFont: 'Orbitron, sans-serif',
      bodySize: '15px',
      headingSize: '52px',
      bodyWeight: '400',
      headingWeight: '900',
    },
    layout: {
      radius: '0rem',
    }
  },
  Vercel: {
    colors: {
      primary: '#000000',
      background: '#FFFFFF',
      surface: '#FAFAFA',
      text: '#000000',
      muted: '#666666',
      border: '#EAEAEA',
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      headingFont: 'Inter, sans-serif',
      bodySize: '14px',
      headingSize: '40px',
      bodyWeight: '400',
      headingWeight: '800',
    },
    layout: {
      radius: '0.375rem',
    }
  },
  DarkMinimal: {
    colors: {
      primary: '#FFFFFF',
      background: '#000000',
      surface: '#111111',
      text: '#FFFFFF',
      muted: '#888888',
      border: '#333333',
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      headingFont: 'Inter, sans-serif',
      bodySize: '16px',
      headingSize: '44px',
      bodyWeight: '300',
      headingWeight: '600',
    },
    layout: {
      radius: '0.5rem',
    }
  }
};
