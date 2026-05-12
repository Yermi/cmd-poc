import type { Schema, Struct } from '@strapi/strapi';

export interface SharedMaintenanceItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_maintenance_items';
  info: {
    displayName: 'Maintenance Item';
  };
  attributes: {
    ButtonText: Schema.Attribute.String;
    DialogType: Schema.Attribute.Enumeration<['Information', 'Block']>;
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
      'shared.maintenance-item': SharedMaintenanceItem;
    }
  }
}
