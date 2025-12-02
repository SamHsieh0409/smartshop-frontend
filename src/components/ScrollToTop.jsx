import { useScrollTrigger, Zoom, Fab, Box } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function ScrollToTop() {
  // 監聽捲動事件
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 300, // 往下捲動超過 300px 出現按鈕
  });

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // 平滑捲動效果
    });
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{
          position: "fixed",
          bottom: 24, // 與 ChatBot 保持一致的高度 (或稍微調整)
          right: 100, // 設在 100px，讓它出現在 ChatBot (24px) 的左邊
          zIndex: 9990,
        }}
      >
        <Fab 
          color="secondary" // 使用次要顏色，跟藍色的 ChatBot 區分
          size="medium" 
          aria-label="scroll back to top"
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Box>
    </Zoom>
  );
}