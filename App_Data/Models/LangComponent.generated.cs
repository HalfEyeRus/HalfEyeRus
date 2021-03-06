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
	// Mixin content Type 1059 with alias "LangComponent"
	/// <summary>Языковой компонент</summary>
	public partial interface ILangComponent : IPublishedContent
	{
		/// <summary>Связанные страницы</summary>
		IEnumerable<IPublishedContent> LinkedPages { get; }
	}

	/// <summary>Языковой компонент</summary>
	[PublishedContentModel("LangComponent")]
	public partial class LangComponent : PublishedContentModel, ILangComponent
	{
#pragma warning disable 0109 // new is redundant
		public new const string ModelTypeAlias = "LangComponent";
		public new const PublishedItemType ModelItemType = PublishedItemType.Content;
#pragma warning restore 0109

		public LangComponent(IPublishedContent content)
			: base(content)
		{ }

#pragma warning disable 0109 // new is redundant
		public new static PublishedContentType GetModelContentType()
		{
			return PublishedContentType.Get(ModelItemType, ModelTypeAlias);
		}
#pragma warning restore 0109

		public static PublishedPropertyType GetModelPropertyType<TValue>(Expression<Func<LangComponent, TValue>> selector)
		{
			return PublishedContentModelUtility.GetModelPropertyType(GetModelContentType(), selector);
		}

		///<summary>
		/// Связанные страницы
		///</summary>
		[ImplementPropertyType("linkedPages")]
		public IEnumerable<IPublishedContent> LinkedPages
		{
			get { return GetLinkedPages(this); }
		}

		/// <summary>Static getter for Связанные страницы</summary>
		public static IEnumerable<IPublishedContent> GetLinkedPages(ILangComponent that) { return that.GetPropertyValue<IEnumerable<IPublishedContent>>("linkedPages"); }
	}
}
