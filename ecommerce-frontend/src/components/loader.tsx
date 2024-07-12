const Loader = () => {
  return (
    <div>
      Loading...
    </div>
  )
}

export default Loader

interface SkeletonProps {
  width?: string;
  length?: number;
}

export const Skeleton = ({width="unset", length = 3} :SkeletonProps) => {

  const skeletons = Array.from({length}, (_,idx) => (
    <div key = {idx} className="Skeleton-shape">

    </div>
  ));
  return <div className="skeleton-loader" style = {{width}}>
    {skeletons}
  </div>
}