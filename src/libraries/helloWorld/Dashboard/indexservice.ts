import { sp } from "@pnp/sp";

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";
import "@pnp/sp/items";

export async function GetListFields(ListName) {
  const DocumentTypeFields = await sp.web.lists
    .getByTitle(ListName)
    .fields.filter(
      "Hidden eq false and Sealed eq false and InternalName ne 'ContentType' and TypeAsString ne 'Computed'and InternalName ne '_UIVersionString' and InternalName ne 'Attachments' and InternalName ne 'AppAuthor' and InternalName ne'FolderChildCount'and InternalName ne '_ComplianceTag'and InternalName ne '_ComplianceTagWrittenTime'and InternalName ne '_ComplianceTagUserId'and InternalName ne 'ComplianceAssetId'and InternalName ne '_ComplianceFlags'and InternalName ne 'ItemChildCount' and InternalName ne 'AppEditor' and InternalName ne'Modified' and InternalName ne 'Created' and InternalName ne 'Author' and InternalName ne 'Editor'"
    )
    .get();
  console.log("DocTypelistfields", DocumentTypeFields);
  return DocumentTypeFields;
}

export const getLookupDetails = async (lookupId, lookupField) => {
  const lookUpData = await sp.web.lists
    .getById(lookupId)
    .items.select(lookupField, "ID")
    .get()
    .then(async (data) => {
      const listTitle = sp.web.lists.getById(lookupId);
      const r = await listTitle.select("Title")();
      console.log("list Title", r.Title);
      let lookupArr = [];
      console.log("getLookupDetails", data);
      data.map((item) => {
        lookupArr.push({
          key: item.Id,
          text: item[lookupField],
          ListName: r.Title,
        });
      });
      console.log("lookupArr", lookupArr);
      return lookupArr;
    })
    .catch((data) => {
      console.log("catchdata----getLookupDetails", data);
    });
  console.log("lookUpData", lookUpData);

  return lookUpData;
};

export const saveItemToList = async (Listname, value) => {
  console.log("saveItemToList", value);
  const listFolders = await sp.web.lists.getByTitle(Listname).items.add({
    Title: value.Title,
    companylocation: value.companylocation,
    employeenameId: value.employeename["key"],
    Experience: value.Experience,
    Additionalcourse: value.Additionalcourse,
    Gender: value.Gender["key"],
    CEOId: value.CEO[0]["id"],
  });
  console.log(listFolders, "list");
  return listFolders;
};