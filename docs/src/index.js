h5a('send', 'track', '事件A', { mobile: '13812345678' });
h5a('send', 'track', '事件B', { email: 'example@example.com' }, { $$exclude: 'Google Analytics' });
h5a('send', 'track', '事件C', { email: 'example@example.com' }, { $$exclude: 'GA' });
h5a('send', 'track', '事件D', { value: 'extra' }, { $$exclude: 'Google Analytics,Latte Bank Stats' });
h5a('send', 'track', '事件E', { value: 'extra' }, { $$exclude: 'GA,LBS' });
