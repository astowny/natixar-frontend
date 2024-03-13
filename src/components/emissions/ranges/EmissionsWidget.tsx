import { useGetEmissionRangesQuery } from "data/store/features/emissions/ranges/EmissionRangesClient"

export const EmissionsWidget = () => {
  const { data } = useGetEmissionRangesQuery()
  const dataText = JSON.stringify(data)

  return <div>{dataText}</div>
}
