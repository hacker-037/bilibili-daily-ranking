export default async function handler(req, res) {
  try {
    // 直接返回固定测试数据，不调用B站接口
    res.status(200).json({
      success: true,
      data: [
        {
          rank: 1,
          title: "测试视频1",
          cover: "https://picsum.photos/300/200",
          playCount: 100000,
          upName: "测试UP主",
          upAvatar: "https://picsum.photos/50/50",
          bvId: "BV1234567890"
        }
      ],
      updateTime: new Date().toLocaleString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
