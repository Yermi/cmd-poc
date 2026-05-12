import type { Schema, Struct } from '@strapi/strapi';

export interface SharedExtandendEnumeration extends Struct.ComponentSchema {
  collectionName: 'components_shared_extandend_enumerations';
  info: {
    displayName: 'ExtandendEnumeration';
  };
  attributes: {
    Text: Schema.Attribute.String;
    Value: Schema.Attribute.Integer;
  };
}

export interface SharedMaintenanceItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_maintenance_items';
  info: {
    displayName: 'Maintenance Item';
  };
  attributes: {
    ButtonText: Schema.Attribute.String;
    DialogTyped: Schema.Attribute.Component<
      'shared.extandend-enumeration',
      true
    >;
    IsEnabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    MaintenanceText: Schema.Attribute.Text;
    MaintenanceTitle: Schema.Attribute.String;
    PublishAt: Schema.Attribute.DateTime;
    RedirectUrl: Schema.Attribute.String;
    UnpublishAt: Schema.Attribute.DateTime;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.extandend-enumeration': SharedExtandendEnumeration;
      'shared.maintenance-item': SharedMaintenanceItem;
    }
  }
}
