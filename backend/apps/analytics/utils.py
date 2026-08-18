def parse_user_agent(user_agent):
    ua = user_agent.lower() if user_agent else ''
    browser = 'Unknown'
    operating_system = 'Unknown'
    device_category = 'Desktop'

    if 'edg/' in ua:
        browser = 'Edge'
    elif 'chrome/' in ua and 'edge' not in ua:
        browser = 'Chrome'
    elif 'firefox/' in ua:
        browser = 'Firefox'
    elif 'safari/' in ua and 'chrome' not in ua:
        browser = 'Safari'
    elif 'opera/' in ua or 'opr/' in ua:
        browser = 'Opera'

    if 'windows' in ua:
        operating_system = 'Windows'
    elif 'mac os' in ua:
        operating_system = 'macOS'
    elif 'android' in ua:
        operating_system = 'Android'
        device_category = 'Mobile'
    elif 'iphone' in ua or 'ipad' in ua:
        operating_system = 'iOS'
        device_category = 'Mobile' if 'iphone' in ua else 'Tablet'
    elif 'linux' in ua:
        operating_system = 'Linux'

    return {
        'browser': browser,
        'operating_system': operating_system,
        'device_category': device_category,
    }
