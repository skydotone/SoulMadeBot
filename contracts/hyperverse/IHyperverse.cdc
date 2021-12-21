import HyperverseModule from 0x4e190c2eb6d78faa
pub contract interface IHyperverse {
    pub var metadata: HyperverseModule.Metadata
    pub resource Tenant {}
    pub event TenantCreated(tenant: Address)
}