import { MidaAsset } from "#assets/MidaAsset";
import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaDate } from "#dates/MidaDate";

export type MidaAssetDeclarationParameters = {
    asset: MidaAsset;
    owner: MidaBrokerAccount;
    date: MidaDate;
    volume: number;
};
