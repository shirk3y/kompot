declare module "*.compot.yml" {
  interface CompotComponent {
    [key: string]: any;
    App: any;
    FanList: any; //FIXME
    FanListItem: any; //FIXME
  }
  const key: CompotComponent;
  export = key;
}

declare module "*.tsv" {
  interface Row {
    [className: string]: any;
  }
  const data: Row[];
  export = data;
}
