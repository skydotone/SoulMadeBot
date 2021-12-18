import HyperverseModule from "./HyperverseModule.cdc"
pub contract interface IHyperverse {
    pub var metadata: HyperverseModule.Metadata
    pub struct Tenant {}
    pub event TenantCreated(tenant: Address)
}