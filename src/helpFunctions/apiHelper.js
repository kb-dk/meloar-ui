import MeloarInstances from "../instances/instances";

export const apiHelper = {
  getApiString
}

function getApiString(loc, endPoint) {
  let apiString = "";
  MeloarInstances.instances.filter(item => {
    item.key === loc ? (apiString = item[endPoint]) : null;
  });
  console.log(apiString)
  return apiString;
}
