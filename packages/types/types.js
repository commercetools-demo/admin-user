module.exports = {
  types : [
    {
      "key": "user-role",
      "name": {
        "en": "User Role"
      },
      "resourceTypeIds": ["customer"],
      "fieldDefinitions": [{
        "name" : "role",
        "type" : {
          "name": "Enum",
          "values": [{
            "key": "basic",
            "label": "Basic"
          },{
            "key": "buyer",
            "label": "Buyer"
          },{
            "key": "buyeradmin",
            "label": "Buyer Admin"
          },{
            "key": "admin",
            "label": "Admin"
          }]
        },
        "label" : {
            "en" : "Role"
        },
        "required" : false,
        "inputHint": "SingleLine"
      }
      ]
    }
  ]
}
