interface LiveStreamIFrameProps {
  width: number;
  height: number;
}

const LiveStreamIFrame = ({ width, height }: LiveStreamIFrameProps) => {
  return (
    <iframe
      src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fstjosephchurchbluffton%2Flive&show_text=false"
      width={width}
      height={height}
      style={{
        border: 'none',
        overflow: 'hidden'
      }}
      scrolling="no"
      frameBorder="0"
      allowFullScreen={true}
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
    />
  );
};

export default LiveStreamIFrame;
