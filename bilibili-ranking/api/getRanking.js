// api/getRanking.js
export default async function handler(req, res) {
  // 1. 配置你的B站Cookie（直接使用你提供的Cookie）
  const BILIBILI_COOKIE = "uuid=101AD2D3C-E2E8-51010E-C8E4-4FC8A21054D4336943infoc; buvid_fp=0d104c03eb843dec15166537b906bf63; enable_web_push=disable; hit-dyn-v2=1; rpdid=|(ummYY)uY)k0J'u~JmYYYm|R; buvid3=9B0EB53C-8757-47D1-A459-9204374F6EDD71441infoc; b_nut=1740217475; LIVE_BUVID=AUTO3517402275643674; CURRENT_BLACKGAP=0; enable_feed_channel=ENABLE; theme-tip-show=SHOWED; theme-avatar-tip-show=SHOWED; theme-switch-show=SHOWED; fingerprint=993b5b4ee4a2ab8be623c543f5fab883; SESSDATA=b4bbae73%2C1766023422%2C1eb91%2A62CjDHJ1Zo8rrwWc6B_XNLg46eM5VuVSu-GSsj2MMaZqxOkISWuJP5ol1Bzd8nWW0BpBASVms0cUZVVWlUeENfYWJJQWNtQmNQQ0RfSFZRRHhEaFJzLVJkQlRMNjMyTmpDMXZHSUQtS0F3XzRxQTU1a0NvdFRiX05ZQ2lZRWZmZG0zRm16ZXh4bmtRIIEC; bili_jct=75322457edebae85a1a8bedf0b5e9070; DedeUserID=660591690; DedeUserID__ckMd5=618206d5e24c85b2; header_theme_version=OPEN; theme_style=light; buvid4=9595A8F8-8164-9228-CEA2-6CAC106FFF4337722-025021523-KHhZxTyr6Wq2tHQBn/WcDQ%3D%3D; PVID=3; bili_ticket=eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTkyNjg2OTksImlhdCI6MTc1OTAwOTQzOSwicGx0IjotMX0.WPHuWMc8TRNhUCNj7gbnxBc7TvfyhRF70u20VcAh-Wg; bili_ticket_expires=1759268639; CURRENT_QUALITY=120; bp_t_offset_660591690=1118414822522748928; b_lsid=A6AA2A36_1999B350895; bmg_af_switch=1; bmg_src_def_domain=i1.hdslb.com; sid=4yhyau1r; CURRENT_FNVAL=4048; home_feed_column=4; browser_resolution=738-834";

  try {
    // 2. 请求B站“全站排行榜”接口（默认获取TOP100，我们取前5）
    const response = await fetch("https://api.bilibili.com/x/web-interface/ranking/v2?rid=0&type=all&arc_type=0&jsonp=jsonp", {
      method: "GET",
      headers: {
        "Cookie": BILIBILI_COOKIE,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36" // 模拟浏览器请求，避免被拦截
      }
    });

    // 3. 解析B站返回的数据，提取TOP5的关键信息
    const data = await response.json();
    if (data.code !== 0) throw new Error("获取B站数据失败，可能Cookie已过期");

    // 提取需要的字段：视频标题、封面、播放量、UP主名称、UP主头像
    const top5Ranking = data.data.list.slice(0, 5).map(item => ({
      rank: item.rank, // 排名（1-5）
      title: item.title, // 视频标题
      cover: item.pic, // 视频封面图
      playCount: item.stat.view, // 播放量
      upName: item.owner.name, // UP主名称
      upAvatar: item.owner.face, // UP主头像
      bvId: item.bvid // 视频BV号（用于跳转B站原视频）
    }));

    // 4. 返回TOP5真实数据给前端
    res.status(200).json({
      success: true,
      data: top5Ranking,
      updateTime: new Date().toLocaleString() // 数据更新时间
    });

  } catch (error) {
    // 错误处理（如Cookie过期、网络问题）
    res.status(500).json({
      success: false,
      message: error.message || "爬取数据失败"
    });
  }
}