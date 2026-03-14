const React = require('react');

function PostCard({
  title,
  subtitle,
  bullets = [],
  cta,
  width = 1080,
  height = 1080,
}) {
  return React.createElement(
    'div',
    {
      style: {
        width: `${width}px`,
        height: `${height}px`,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px',
        fontFamily: 'Arial, Helvetica, sans-serif',
        background:
          'linear-gradient(135deg, rgba(244,248,242,1) 0%, rgba(222,236,215,1) 100%)',
        color: '#1f2a1f',
      },
    },
    [
      React.createElement(
        'div',
        { key: 'top' },
        [
          React.createElement(
            'div',
            {
              key: 'badge',
              style: {
                display: 'inline-block',
                padding: '10px 18px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.65)',
                border: '1px solid rgba(31,42,31,0.12)',
                fontSize: '28px',
                marginBottom: '28px',
              },
            },
            'English tips'
          ),
          React.createElement(
            'h1',
            {
              key: 'title',
              style: {
                margin: 0,
                fontSize: '74px',
                lineHeight: 1.05,
                fontWeight: 800,
                letterSpacing: '-1px',
              },
            },
            title || 'Post title'
          ),
          React.createElement(
            'p',
            {
              key: 'subtitle',
              style: {
                marginTop: '26px',
                marginBottom: 0,
                fontSize: '34px',
                lineHeight: 1.35,
                color: '#314131',
                maxWidth: '850px',
              },
            },
            subtitle || ''
          ),
        ]
      ),

      React.createElement(
        'div',
        { key: 'middle', style: { marginTop: '36px', flex: 1 } },
        bullets.map((item, index) =>
          React.createElement(
            'div',
            {
              key: index,
              style: {
                display: 'flex',
                alignItems: 'flex-start',
                gap: '18px',
                marginBottom: '22px',
                background: 'rgba(255,255,255,0.55)',
                border: '1px solid rgba(31,42,31,0.10)',
                borderRadius: '28px',
                padding: '20px 24px',
              },
            },
            [
              React.createElement(
                'div',
                {
                  key: 'num',
                  style: {
                    minWidth: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: 700,
                    background: '#1f2a1f',
                    color: '#fff',
                    marginTop: '2px',
                  },
                },
                String(index + 1)
              ),
              React.createElement(
                'div',
                {
                  key: 'text',
                  style: {
                    fontSize: '30px',
                    lineHeight: 1.35,
                    paddingTop: '4px',
                  },
                },
                item
              ),
            ]
          )
        )
      ),

      React.createElement(
        'div',
        {
          key: 'footer',
          style: {
            marginTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
        },
        [
          React.createElement(
            'div',
            {
              key: 'cta',
              style: {
                fontSize: '30px',
                fontWeight: 700,
              },
            },
            cta || 'Follow for more'
          ),
          React.createElement(
            'div',
            {
              key: 'brand',
              style: {
                fontSize: '26px',
                opacity: 0.75,
              },
            },
            '@your_english_project'
          ),
        ]
      ),
    ]
  );
}

exports.PostCard = PostCard;