//------------------------------------------------------------------------------
// <auto-generated>
//   This code was generated by a tool.
//
//    Umbraco.ModelsBuilder v3.0.7.99
//
//   Changes to this file will be lost if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Web;
using Umbraco.Core.Models;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Web;
using Umbraco.ModelsBuilder;
using Umbraco.ModelsBuilder.Umbraco;

namespace Umbraco.Web.PublishedContentModels
{
	/// <summary>_Блок с изображением</summary>
	[PublishedContentModel("TextWithImageBlock")]
	public partial class TextWithImageBlock : TextWithHeaderBlock
	{
#pragma warning disable 0109 // new is redundant
		public new const string ModelTypeAlias = "TextWithImageBlock";
		public new const PublishedItemType ModelItemType = PublishedItemType.Content;
#pragma warning restore 0109

		public TextWithImageBlock(IPublishedContent content)
			: base(content)
		{ }

#pragma warning disable 0109 // new is redundant
		public new static PublishedContentType GetModelContentType()
		{
			return PublishedContentType.Get(ModelItemType, ModelTypeAlias);
		}
#pragma warning restore 0109

		public static PublishedPropertyType GetModelPropertyType<TValue>(Expression<Func<TextWithImageBlock, TValue>> selector)
		{
			return PublishedContentModelUtility.GetModelPropertyType(GetModelContentType(), selector);
		}

		///<summary>
		/// Изображение
		///</summary>
		[ImplementPropertyType("image")]
		public IPublishedContent Image
		{
			get { return this.GetPropertyValue<IPublishedContent>("image"); }
		}

		///<summary>
		/// Краткий текст
		///</summary>
		[ImplementPropertyType("shortText")]
		public string ShortText
		{
			get { return this.GetPropertyValue<string>("shortText"); }
		}
	}
}
