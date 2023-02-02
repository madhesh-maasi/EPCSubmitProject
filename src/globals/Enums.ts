export namespace Enums {
    
    export enum FieldTypes {
        TaxonomyMulti = "TaxonomyFieldTypeMulti",
        TaxonomySingle = "TaxonomyFieldType",
        PersonMulti = "UserMulti",
        PersonSingle = "User",
        Link = "URL",
        Lookup = "",
        LookupMulti = ""
    }

    export enum MapperType {
        PNPResult,
        PnPControlResult,
        CAMLResult,
        SearchResult,
        None
    }

    export enum ItemResultType{
        
        //Common Result Types
        None,
        User,
        UserProfile,
        Users,
        Document,
        Item,
        Task,

        //Solution Specific Result Types
        
        PEPI_PEPIDetails,
        PEPI_ItemID,
        PEPI_QuestionText,
        PEPI_CombineReviews,
        PEPI_CombineAdmin,
        PEPI_SplitReviews,
        PEPI_SplitAdmin,
        PEPI_SpecialReviews,
        
    }

    export enum DataPayloadTypes{
        PnPCreateUpdate,
        PnPValidateUpdate
    }

    export enum ButtonTypes {
        Save
    }

    export enum UserRoles {
        Reviewee,
        Reviewer,
        SuperAdmin
    }

    export enum FormModes{
        CollectFeedback,
        SubmitFeedback,
        NotFinalized,
        MixMode
    }
    
    // export enum StatusOfReview{
    //     CollectFeedback,
    //     SubmitFeedback,
    //     NotFinalized,
    //     MixMode
    // }
}